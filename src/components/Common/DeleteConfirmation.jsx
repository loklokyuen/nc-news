export default function DeleteConfirmation({
	setConfirmDeletion,
	onItemDeleted,
	itemType,
}) {
	return (
		<section className="flex flex-col items-center rounded-2xl w-md p-0">
			<div className="bg-mandys-pink-100/80 w-full py-2 border-b border-mandys-pink-200 text-center rounded-t-xl ">
				<h3 className="text-mandys-pink-800 font-bold text-xl">
					<i className="fas fa-exclamation-triangle mr-1 text-mandys-pink-500"></i>
					Confirm Deletion
				</h3>
			</div>

			<div className="p-6 text-center">
				<p className="text-neutral mb-4">
					Are you sure you want to delete this {itemType}?
					<br />
					<span className="text-sm text-gray-600 mt-1 block">
						This action cannot be undone.
					</span>
				</p>

				<div className="flex justify-center">
					<button className="cancel" onClick={() => setConfirmDeletion(false)}>
						Cancel
					</button>
					<button
						className="alert bg-mandys-pink-500 hover:bg-mandys-pink-50 rounded-lg"
						onClick={onItemDeleted}
					>
						Delete {itemType}
					</button>
				</div>
			</div>
		</section>
	);
}
