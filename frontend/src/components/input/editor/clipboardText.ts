import type {Fragment, Slice} from '@tiptap/pm/model'

// Plain text for the clipboard. ProseMirror's default drops list structure entirely, so a
// copied bullet list would paste as bare lines. Keep the markers so the text still reads as a list.
export function sliceToPlainText(slice: Slice): string {
	const lines: string[] = []
	appendBlocks(slice.content, '', lines)
	return lines.join('\n')
}

function appendBlocks(fragment: Fragment, indent: string, lines: string[]) {
	fragment.forEach(node => {
		if (node.type.name === 'listItem') {
			let isFirstLine = true
			node.forEach(child => {
				if (child.isTextblock) {
					const prefix = isFirstLine ? `${indent}- ` : `${indent}  `
					lines.push(`${prefix}${child.textContent}`)
					isFirstLine = false
				} else {
					appendBlocks(child.content, `${indent}  `, lines)
				}
			})
		} else if (node.isTextblock) {
			lines.push(`${indent}${node.textContent}`)
		} else {
			appendBlocks(node.content, indent, lines)
		}
	})
}
