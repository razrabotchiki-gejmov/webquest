import './Inventory.css'; // Подключение стилей для инвентаря

let isVisible = false;

function Open() {
        isVisible = true;

return (
    <div>
        {isVisible && (
            <div className="inventory-window">
                <h1>Инвентарь</h1>
                <p>Здесь будут лежать ваши предметы...</p>
            </div>
        )}
    </div>
);
}
export default Open;