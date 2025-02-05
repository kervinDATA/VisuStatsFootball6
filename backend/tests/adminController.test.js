// Importation du contrôleur
const adminController = require('../controllers/adminController');

// Mock de la base de données
jest.mock('../config/db', () => ({
  query: jest.fn(), // Fonction mockée pour simuler les requêtes SQL
}));

const db = require('../config/db');

// Mock des objets req et res
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('adminController.getUsers', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Nettoyage des mocks après chaque test
  });

  it('devrait retourner la liste des utilisateurs', async () => {
    const req = {};
    const res = mockResponse();

    const mockUsers = [
      { id: '1', email: 'test1@example.com', role: 'user' },
      { id: '2', email: 'test2@example.com', role: 'admin' },
    ];

    db.query.mockResolvedValue({ rows: mockUsers });

    await adminController.getUsers(req, res);

    expect(db.query).toHaveBeenCalledWith('SELECT id, email, role FROM dev_app_foot.users');
    expect(res.json).toHaveBeenCalledWith(mockUsers);
    expect(res.status).not.toHaveBeenCalled();
  });

  it('devrait retourner une erreur en cas de problème avec la base de données', async () => {
    const req = {};
    const res = mockResponse();
    const mockError = new Error('Erreur de connexion');

    db.query.mockRejectedValue(mockError);

    await adminController.getUsers(req, res);

    expect(db.query).toHaveBeenCalledWith('SELECT id, email, role FROM dev_app_foot.users');
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Erreur lors de la récupération des utilisateurs.' });
  });
});

describe('adminController.deleteUser', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('devrait supprimer un utilisateur avec succès', async () => {
    const req = { params: { id: '1' } };
    const res = mockResponse();

    db.query.mockResolvedValueOnce({ rowCount: 1 });

    await adminController.deleteUser(req, res);

    expect(db.query).toHaveBeenCalledWith(
      'DELETE FROM dev_app_foot.users WHERE id = $1',
      [req.params.id]
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Utilisateur supprimé avec succès.' });
  });

  it('devrait retourner une erreur si l’utilisateur n’existe pas', async () => {
    const req = { params: { id: '999' } };
    const res = mockResponse();

    db.query.mockResolvedValueOnce({ rowCount: 0 });

    await adminController.deleteUser(req, res);

    expect(db.query).toHaveBeenCalledWith(
      'DELETE FROM dev_app_foot.users WHERE id = $1',
      [req.params.id]
    );
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Utilisateur non trouvé." });
  });

  it('devrait retourner une erreur serveur en cas de problème avec la base de données', async () => {
    const req = { params: { id: '1' } };
    const res = mockResponse();

    db.query.mockRejectedValue(new Error('Erreur de la base de données'));

    await adminController.deleteUser(req, res);

    expect(db.query).toHaveBeenCalledWith(
      'DELETE FROM dev_app_foot.users WHERE id = $1',
      [req.params.id]
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Erreur lors de la suppression.' });
  });
});

describe('adminController.getGlobalStatistics', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('devrait retourner les statistiques globales avec succès', async () => {
    const req = {};
    const res = mockResponse();

    db.query
      .mockResolvedValueOnce({ rows: [{ totalusers: '10' }] })
      .mockResolvedValueOnce({ rows: [{ totalanalyses: '5' }] });

    await adminController.getGlobalStatistics(req, res);

    expect(db.query).toHaveBeenCalledWith('SELECT COUNT(*) AS totalusers FROM dev_app_foot.users');
    expect(db.query).toHaveBeenCalledWith('SELECT COUNT(*) AS totalanalyses FROM dev_app_foot.user_saved_analyses');
    expect(res.json).toHaveBeenCalledWith({ totalUsers: 10, totalAnalyses: 5 });
  });

  it('devrait retourner une erreur en cas de problème avec la base de données', async () => {
    const req = {};
    const res = mockResponse();

    db.query.mockRejectedValue(new Error('Erreur de la base de données'));

    await adminController.getGlobalStatistics(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Erreur lors de la récupération des statistiques.' });
  });
});