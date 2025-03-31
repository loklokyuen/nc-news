export default function DropdownMenu({ options }) {
	return (
		<div className="dropdown-menu absolute right-0 top-6 bg-white shadow-lg border border-primary-light/20 rounded-lg p-1.5 z-20">
			<div className="divide-y divide-primary-light/50">
				{options.map((option, index) => (
					<p
						key={index}
						className="block text-left px-3 py-2 rounded-md text-primary tertiary-interactive hover:bg-mandys-pink-100/50 text-nowrap my-0.5"
						onClick={option.onClick}
					>
						{option.label}
					</p>
				))}
			</div>
		</div>
	);
}
