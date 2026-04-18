type RunDetailsPageProps = {
	params: Promise<{ id: string }>
}

const RunDetailsPage = async ({ params }: RunDetailsPageProps) => {
	const { id } = await params

	return (
		<div className="min-h-screen bg-gray-50 p-6 text-black">
			<h1 className="font-helvetica text-3xl tracking-wide">Run Details</h1>
			<p className="mt-2 font-helvetica text-sm text-gray-600">
				Viewing run: {id}
			</p>
		</div>
	)
}

export default RunDetailsPage
