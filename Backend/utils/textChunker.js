

export const chunkText = (text, chunkSize = 500, overlap = 50) => {
    if (!text || text.trim().length === 0) return []

    const cleanedText = text
        .replace(/\r\n/g, '\n')
        .replace(/\s+/g, ' ')
        .replace(/\n /g, '\n')
        .replace(/ \n/g, '\n')
        .trim()

    const paragraphs = cleanedText
        .split(/\n/g)
        .filter(p => p.trim().length > 0)

    const chunks = []
    let currentChunk = []
    let currentWordCount = 0
    let chunkIndex = 0

    for (const paragraph of paragraphs) {
        const paragraphWords = paragraph.trim().split(/\s+/)
        const paragraphWordCount = paragraphWords.length

      // If single paragraph exceeds chunk size, split it by words
if (paragraphWordCount > chunkSize) {

    // Safety guard (do once)
    const safeOverlap = Math.min(overlap, chunkSize - 1)

    let start = 0
    while (start < paragraphWords.length) {
        const end = start + chunkSize
        const slice = paragraphWords.slice(start, end)

        chunks.push({
            content: slice.join(' '),
            chunkIndex: chunkIndex++
        })

        // ✅ Move window forward (CRITICAL)
        start += (chunkSize - safeOverlap)
    }
    continue
}


        // If adding this paragraph exceeds chunk size, save current chunk
        if (currentWordCount + paragraphWordCount > chunkSize) {
            chunks.push({
                content: currentChunk.join('\n'),
                chunkIndex: chunkIndex++
            })

            // Create overlap from previous chunk
            if (overlap > 0) {
                const overlapWords = currentChunk
                    .join(' ')
                    .split(/\s+/)
                    .slice(-overlap)

                currentChunk = [overlapWords.join(' ')]
                currentWordCount = overlapWords.length
            } else {
                currentChunk = []
                currentWordCount = 0
            }
        }

        // Add paragraph to current chunk
        currentChunk.push(paragraph)
        currentWordCount += paragraphWordCount
    }

    // Add the last chunk
    if (currentChunk.length > 0) {
        chunks.push({
            content: currentChunk.join('\n'),
            chunkIndex: chunkIndex++
        })
    }

    // Fallback: if no chunks created, split by words
    if (chunks.length === 0) {
        const words = cleanedText.split(/\s+/)
        let start = 0

        while (start < words.length) {
            const end = start + chunkSize
            chunks.push({
                content: words.slice(start, end).join(' '),
                chunkIndex: chunkIndex++
            })
            start += (chunkSize - overlap)
        }
    }

    return chunks
}


export const findRelevantChunks = (chunks, query, maxChunks = 3) => {
    if (!chunks || chunks.length === 0 || !query) return []

    const stopwords = new Set([
        'the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'but', 'or',
        'in', 'with', 'to', 'for', 'of', 'as', 'by', 'this', 'that', 'it'
    ])

    // 1️⃣ Extract and clean query words
    const queryWords = query
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 1 && !stopwords.has(word))

    if (queryWords.length === 0) return []

    // 2️⃣ Score each chunk
    const scoredChunks = chunks.map((chunk, index) => {
        const text = chunk.content.toLowerCase()
        const words = text.split(/\s+/)

        let score = 0
        const matchedWords = new Set()

        for (const qWord of queryWords) {
            for (const word of words) {
                if (word === qWord) {
                    score += 3
                    matchedWords.add(qWord)
                }
                else if (word.includes(qWord) || qWord.includes(word)) {
                    score += 1
                    matchedWords.add(qWord)
                }
            }
        }

        // Bonus: multiple query words found
        if (matchedWords.size > 1) {
            score += matchedWords.size * 2
        }

        // Normalize by content length
        const normalizedScore = score / Math.sqrt(words.length || 1)

        // Small bonus for earlier chunks
        const positionBonus = 1 + (1 / (index + 1))

        return {
            content: chunk.content,
            chunkIndex: chunk.chunkIndex,
            pageNumber: chunk.pageNumber,
            _id: chunk._id,
            score: normalizedScore * positionBonus,
            rawScore: score,
            matchedWords: Array.from(matchedWords)
        }
    })

    return scoredChunks
        .filter(c => c.score > 0)
        .sort((a, b) => {
            // 1️⃣ Primary: relevance score
            if (b.score !== a.score) {
                return b.score - a.score
            }

            // 2️⃣ Secondary: number of matched query words
            if (b.matchedWords.length !== a.matchedWords.length) {
                return b.matchedWords.length - a.matchedWords.length
            }

            // 3️⃣ Tertiary: earlier chunk wins
            return a.chunkIndex - b.chunkIndex
        })
        .slice(0, maxChunks)

}
