export async function* readStream(response: Response) {
  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    
    buffer += decoder.decode(value, { stream: true });
    const chunks = buffer.split("\n\n");
    buffer = chunks.pop() || "";
    
    for (const chunk of chunks) {
      const dataStr = chunk.replace(/^data: /, "").trim();
      if (dataStr) yield JSON.parse(dataStr);
    }
  }
}