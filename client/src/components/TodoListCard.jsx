import { useCallback, useEffect, useState } from 'react';
import { AddItemForm } from './AddNewItemForm';
import { ItemDisplay } from './ItemDisplay';

export function TodoListCard() {
    const [items, setItems] = useState(null);

    useEffect(() => {
        fetch('/api/items')
            .then((r) => r.json())
            .then(setItems);
    }, []);


    const onNewItem = useCallback(
        (newItem) => {
            setItems((prevItems) => [...prevItems, newItem]);
        },
        [],
    );
    const onItemUpdate = useCallback(
        (updatedItem) => {
            setItems((prevItems) => 
                prevItems.map((item) =>
                    item.id === updatedItem.id ? updatedItem : item
                )
            );
        },
        [],
    );
    const onItemRemoval = useCallback(
        (itemToRemove) => {
            setItems((prevItems) =>
                prevItems.filter((item) => item.id !== itemToRemove.id)
            );
        },
        [],
    );

    if (items === null) return 'Loading...';
    const currentItemsCount = items.length;

    return (
        <>
            <AddItemForm onNewItem={onNewItem} currentItemsCount={currentItemsCount} />
            {items.length === 0 && (
                <p className="text-center">No items yet! Add one above!</p>
            )}
            {items.map((item) => (
                <ItemDisplay
                    key={item.id}
                    item={item}
                    onItemUpdate={onItemUpdate}
                    onItemRemoval={onItemRemoval}
                />
            ))}
        </>
    );
}
