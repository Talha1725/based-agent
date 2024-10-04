import {QueryClientProvider, QueryClient} from '@tanstack/react-query';
import {useState} from 'react';

const ReactQueryProvider = ({children}) => {
	const [queryClient] = useState(() => new QueryClient({
		defaultOptions: {
			queries: {
				retry: false, // Optionally set default retry behavior
			},
			mutations: {
				retry: false, // Set default mutation retry behavior
			},
		},
	}));
	
	return (
		<QueryClientProvider client={queryClient}>
			{children}
		</QueryClientProvider>
	);
};

export default ReactQueryProvider;
