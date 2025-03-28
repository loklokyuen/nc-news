export default function DropdownMenu({ options }) {
	return (
		<div className="dropdown-menu absolute right-0 top-6 bg-white shadow-md rounded-lg p-2 z-20 divide-primary-light/50 divide-y">
			{options.map((option, index) => (
				<p
					key={index}
					className="block text-left px-2 py-1.5 rounded-lg text-tertiary tertiary-interactive hover:bg-gray-100/50 w-full text-nowrap"
					onClick={option.onClick}>
					{option.label}
				</p>
			))}
		</div>
	);
}
