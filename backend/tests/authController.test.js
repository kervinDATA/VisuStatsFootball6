// Importation du contrôleur
const authController = require('../controllers/authController');

// Mocks des dépendances
jest.mock('../config/db', () => ({
  query: jest.fn(),
}));

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock des objets req et res
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('authController.register', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Nettoyage des mocks après chaque test
  });

  it('devrait enregistrer un utilisateur avec succès', async () => {
    const req = {
      body: {
        email: 'test@example.com',
        password: 'password123',
      },
    };
    const res = mockResponse();

    db.query.mockResolvedValueOnce({ rows: [] }); // Pas d'utilisateur existant
    bcrypt.hash.mockResolvedValue('hashedPassword123'); // Mock du hash

    await authController.register(req, res);

    expect(db.query).toHaveBeenCalledWith(
      'SELECT * FROM dev_app_foot.users WHERE email = $1',
      [req.body.email]
    );
    expect(bcrypt.hash).toHaveBeenCalledWith(req.body.password, 10);
    expect(db.query).toHaveBeenCalledWith(
      'INSERT INTO dev_app_foot.users (email, password) VALUES ($1, $2)',
      [req.body.email, 'hashedPassword123']
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'Utilisateur enregistré avec succès' });
  });

  it("devrait retourner une erreur si l'e-mail est invalide", async () => {
    const req = { body: { email: 'invalidEmail', password: 'password123' } };
    const res = mockResponse();

    await authController.register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Adresse email invalide' });
  });

  it('devrait retourner une erreur si le mot de passe est trop court', async () => {
    const req = { body: { email: 'test@example.com', password: '123' } };
    const res = mockResponse();

    await authController.register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Le mot de passe doit contenir au moins 6 caractères' });
  });

  it('devrait retourner une erreur si l’utilisateur existe déjà', async () => {
    const req = { body: { email: 'test@example.com', password: 'password123' } };
    const res = mockResponse();

    db.query.mockResolvedValueOnce({ rows: [{ id: 1, email: 'test@example.com' }] });

    await authController.register(req, res);

    expect(db.query).toHaveBeenCalledWith(
      'SELECT * FROM dev_app_foot.users WHERE email = $1',
      [req.body.email]
    );
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Utilisateur déjà enregistré' });
  });

  it('devrait retourner une erreur serveur en cas de problème avec la base de données', async () => {
    const req = { body: { email: 'test@example.com', password: 'password123' } };
    const res = mockResponse();

    db.query.mockRejectedValue(new Error('Erreur de la base de données'));

    await authController.register(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Erreur serveur' });
  });
});

describe('authController.login', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Nettoyage des mocks après chaque test
  });

  it('devrait connecter un utilisateur avec succès', async () => {
    const req = {
      body: {
        email: 'test@example.com',
        password: 'password123',
      },
    };
    const res = mockResponse();

    const mockUser = { id: '1', email: 'test@example.com', password: 'hashedPassword123' };

    db.query.mockResolvedValueOnce({ rows: [mockUser] });
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('mockedToken123');

    await authController.login(req, res);

    expect(db.query).toHaveBeenCalledWith(
      'SELECT * FROM dev_app_foot.users WHERE email = $1',
      [req.body.email]
    );
    expect(bcrypt.compare).toHaveBeenCalledWith(req.body.password, mockUser.password);
    expect(jwt.sign).toHaveBeenCalledWith({ id: mockUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ user: mockUser, token: 'mockedToken123' });
  });

  it('devrait retourner une erreur si l’utilisateur n’existe pas', async () => {
    const req = { body: { email: 'nonexistent@example.com', password: 'password123' } };
    const res = mockResponse();

    db.query.mockResolvedValueOnce({ rows: [] });

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Utilisateur non trouvé' });
  });

  it('devrait retourner une erreur si le mot de passe est incorrect', async () => {
    const req = { body: { email: 'test@example.com', password: 'wrongpassword' } };
    const res = mockResponse();

    const mockUser = { id: '1', email: 'test@example.com', password: 'hashedPassword123' };

    db.query.mockResolvedValueOnce({ rows: [mockUser] });
    bcrypt.compare.mockResolvedValue(false);

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Mot de passe incorrect' });
  });

  it('devrait retourner une erreur serveur en cas de problème avec la base de données', async () => {
    const req = { body: { email: 'test@example.com', password: 'password123' } };
    const res = mockResponse();

    db.query.mockRejectedValue(new Error('Erreur de la base de données'));

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Erreur serveur lors de la connexion' });
  });
});