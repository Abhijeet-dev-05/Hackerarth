import { useState, useRef, useEffect } from 'react'

export default function CodeEditor({ value, onChange, language }) {
  const textareaRef = useRef(null)
  const [lineCount, setLineCount] = useState(1)

  useEffect(() => {
    const lines = value.split('\n').length
    setLineCount(lines)
  }, [value])

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const start = e.target.selectionStart
      const end = e.target.selectionEnd
      const newVal = value.substring(0, start) + '    ' + value.substring(end)
      onChange(newVal)
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = start + 4
          textareaRef.current.selectionEnd = start + 4
        }
      })
    }
  }

  return (
    <div className="flex h-full bg-[#1e1e2e] overflow-hidden">
      {/* Line numbers */}
      <div className="line-numbers pt-3 pb-3 pl-4 select-none shrink-0 bg-[#1e1e2e] min-w-[40px]">
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i + 1}>{i + 1}</div>
        ))}
      </div>
      {/* Divider */}
      <div className="w-px bg-[#313244] shrink-0" />
      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="code-editor flex-1 pt-3 pb-3 pl-4 pr-4 h-full resize-none border-none focus:outline-none"
        spellCheck={false}
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
      />
    </div>
  )
}
