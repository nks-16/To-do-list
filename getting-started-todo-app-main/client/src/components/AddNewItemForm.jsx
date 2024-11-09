import { useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Alert from 'react-bootstrap/Alert';

export function AddItemForm({ onNewItem, currentItemsCount }) {
    const [newItem, setNewItem] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const submitNewItem = (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(''); // Clear any previous errors

        // Check if the current item count is 5 or more
        if (currentItemsCount >= 5) {
            setSubmitting(false);
            setError('You can only add up to 5 items!');
            return;
        }

        const options = {
            method: 'POST',
            body: JSON.stringify({ name: newItem }),
            headers: { 'Content-Type': 'application/json' },
        };

        fetch('/api/items', options)
            .then((r) => {
                if (!r.ok) {
                    throw new Error('Failed to add item');
                }
                return r.json();
            })
            .then((item) => {
                onNewItem(item);  // Notify parent component with the new item
                setSubmitting(false);
                setNewItem('');
            })
            .catch((err) => {
                setSubmitting(false);
                setError(err.message);
            });
    };

    return (
        <div>
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={submitNewItem}>
                <InputGroup className="mb-3">
                    <Form.Control
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        type="text"
                        placeholder="Add anything New"
                        aria-label="Add anything New"
                    />
                    <Button
                        type="submit"
                        variant="success"
                        disabled={!newItem.length || submitting}
                        className={submitting ? 'disabled' : ''}
                    >
                        {submitting ? 'Adding...' : 'Add Item'}
                    </Button>
                </InputGroup>
            </Form>
        </div>
    );
}

AddItemForm.propTypes = {
    onNewItem: PropTypes.func.isRequired,
    currentItemsCount: PropTypes.number.isRequired, // The current number of items to check the limit
};
