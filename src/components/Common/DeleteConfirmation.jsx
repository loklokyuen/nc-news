export default function DeleteConfirmation({ setConfirmDeletion, onItemDeleted, itemType }){
    return <section className="flex flex-col items-center rounded-2xl bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
    <h1 className="title">Confirm deleting {itemType}?</h1>

    <div className="mt-4">
        <button className="mx-1" onClick={() => setConfirmDeletion(false)}>Cancel</button>
        <button onClick={onItemDeleted}>Confirm delete</button>
    </div>
</section>
}