const db = require('../../src/persistence');
const addItem = require('../../src/routes/addItem');
const ITEM = { id: 12345 };
const { v4: uuid } = require('uuid');
let cons = 0;

jest.mock('uuid', () => ({ v4: jest.fn() }));

jest.mock('../../src/persistence', () => ({
    removeItem: jest.fn(),
    storeItem: jest.fn(),
    getItem: jest.fn(),
}));

test('it stores item correctly or returns error when limit is reached', async () => {
    const id = 'something-not-a-uuid';
    const name = 'A sample item';
    const req = { body: { name } };
    const res = { send: jest.fn(), status: jest.fn().mockReturnThis() };

    uuid.mockReturnValue(id);

    if (cons === 5) {
        res.status(400).send({ error: 'Only 5 items are allowed' });
    } else {
        await addItem(req, res);
        cons += 1;
    }
    if (cons <= 5) {
        const expectedItem = { id, name, completed: false };

        expect(db.storeItem.mock.calls.length).toBe(1);
        expect(db.storeItem.mock.calls[0][0]).toEqual(expectedItem);
        expect(res.send.mock.calls[0].length).toBe(1);
        expect(res.send.mock.calls[0][0]).toEqual(expectedItem);
    } else {
        expect(res.status.mock.calls.length).toBe(1);
        expect(res.status.mock.calls[0][0]).toBe(400);
        expect(res.send.mock.calls[0][0]).toEqual({ error: 'Only 5 items are allowed' });
    }
});
