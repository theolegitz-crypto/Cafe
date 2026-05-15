import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import express from 'express';
import multer from 'multer';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const dataFile = path.join(__dirname, 'data', 'menu.json');
const uploadsDir = path.join(rootDir, 'uploads');
const distDir = path.join(rootDir, 'dist');

const app = express();
const port = Number(process.env.PORT || 3001);
const adminPassword = process.env.ADMIN_PASSWORD || 'change-me-admin';
const sessionSecret =
  process.env.ADMIN_SESSION_SECRET || 'amber-table-dev-session-secret';

const storage = multer.diskStorage({
  destination: async (_request, _file, callback) => {
    await fs.mkdir(uploadsDir, { recursive: true });
    callback(null, uploadsDir);
  },
  filename: (_request, file, callback) => {
    const ext = path.extname(file.originalname) || '.jpg';
    const safeName = file.originalname
      .replace(ext, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/gi, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40);

    callback(null, `${Date.now()}-${safeName || 'dish'}${ext}`);
  },
});

const upload = multer({ storage });

app.use(express.json({ limit: '2mb' }));
app.use('/uploads', express.static(uploadsDir));

function parseCookies(cookieHeader = '') {
  return cookieHeader
    .split(';')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .reduce((acc, entry) => {
      const [key, ...rest] = entry.split('=');
      acc[key] = decodeURIComponent(rest.join('='));
      return acc;
    }, {});
}

function createSessionToken() {
  const expires = Date.now() + 1000 * 60 * 60 * 24 * 7;
  const payload = String(expires);
  const signature = crypto
    .createHmac('sha256', sessionSecret)
    .update(payload)
    .digest('hex');

  return `${payload}.${signature}`;
}

function verifySessionToken(token) {
  if (!token) {
    return false;
  }

  const [payload, signature] = token.split('.');

  if (!payload || !signature) {
    return false;
  }

  if (Number(payload) < Date.now()) {
    return false;
  }

  const expected = crypto
    .createHmac('sha256', sessionSecret)
    .update(payload)
    .digest('hex');

  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

async function readMenu() {
  const file = await fs.readFile(dataFile, 'utf8');
  return JSON.parse(file);
}

async function writeMenu(payload) {
  const categories = [...new Set(payload.items.map((item) => item.category))];
  const normalized = {
    categories,
    items: payload.items,
  };

  await fs.writeFile(dataFile, JSON.stringify(normalized, null, 2), 'utf8');
  return normalized;
}

function requireAdmin(request, response, next) {
  const cookies = parseCookies(request.headers.cookie);
  const token = cookies.admin_token;

  if (!verifySessionToken(token)) {
    response.status(401).json({ error: 'unauthorized' });
    return;
  }

  next();
}

app.get('/api/menu', async (_request, response) => {
  const menu = await readMenu();
  response.json(menu);
});

app.get('/api/admin/session', requireAdmin, (_request, response) => {
  response.json({ authenticated: true });
});

app.post('/api/admin/login', (request, response) => {
  const { password } = request.body ?? {};

  if (!password || password !== adminPassword) {
    response.status(401).json({ error: 'invalid_password' });
    return;
  }

  const token = createSessionToken();
  response.setHeader(
    'Set-Cookie',
    `admin_token=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=604800`,
  );
  response.json({ success: true });
});

app.post('/api/admin/logout', (_request, response) => {
  response.setHeader(
    'Set-Cookie',
    'admin_token=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0',
  );
  response.json({ success: true });
});

app.get('/api/admin/menu', requireAdmin, async (_request, response) => {
  const menu = await readMenu();
  response.json(menu);
});

app.post('/api/admin/items', requireAdmin, async (request, response) => {
  const menu = await readMenu();
  menu.items.push(request.body);
  const saved = await writeMenu(menu);
  response.status(201).json(saved);
});

app.put('/api/admin/items/:id', requireAdmin, async (request, response) => {
  const menu = await readMenu();
  const index = menu.items.findIndex((item) => item.id === request.params.id);

  if (index === -1) {
    response.status(404).json({ error: 'not_found' });
    return;
  }

  menu.items[index] = request.body;
  const saved = await writeMenu(menu);
  response.json(saved);
});

app.delete('/api/admin/items/:id', requireAdmin, async (request, response) => {
  const menu = await readMenu();
  menu.items = menu.items.filter((item) => item.id !== request.params.id);
  const saved = await writeMenu(menu);
  response.json(saved);
});

app.post('/api/admin/upload', requireAdmin, upload.single('image'), (request, response) => {
  if (!request.file) {
    response.status(400).json({ error: 'file_required' });
    return;
  }

  response.status(201).json({
    url: `/uploads/${request.file.filename}`,
  });
});

app.get('/api/health', (_request, response) => {
  response.json({ ok: true });
});

app.use(express.static(distDir));

app.get('*', async (request, response, next) => {
  if (request.path.startsWith('/api/')) {
    next();
    return;
  }

  response.sendFile(path.join(distDir, 'index.html'));
});

app.listen(port, async () => {
  await fs.mkdir(uploadsDir, { recursive: true });
  console.log(`Amber Table server listening on http://localhost:${port}`);
});
