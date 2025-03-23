export async function POST(req: Request) {
	try {
		const {messages} = await req.json(); 
        const lastMessageContent = messages[messages.length -1].content;

        
        const parsed = JSON.parse(lastMessageContent);
        const topic = parsed.topic
        const clarification = parsed.clarification


		return new Response(
			JSON.stringify({
				success: true,
			}),
			{ status: 200 }
		);
	} catch (err) {

        return new Response(
			JSON.stringify({
				success: false,
                err: err instanceof Error ? err.message: "Invalid message format!"
			}),
			{ status: 500 }
		);
    }
}
