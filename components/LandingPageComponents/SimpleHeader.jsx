import React from 'react';
import Link from 'next/link';

const SimpleHeader = () => (
	<header className="bg-white py-4 px-6">
		<div className="flex justify-between items-center">
			<Link href="/" className="text-2xl font-bold text-blue-600">BasedAgent</Link>
		
		</div>
	</header>
);

export default SimpleHeader;