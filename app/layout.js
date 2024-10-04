import Head from "next/head";

export default function Layout({children}) {
	return (
		<>
			<Head>
				<link rel="icon" href="/favicon.ico"/>
				<title>Based Agents</title>
			</Head>
			{children}
		</>
	);
}
