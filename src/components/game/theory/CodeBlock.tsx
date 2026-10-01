/** Bloque de código estilo editor con un resaltado mínimo para CSS. */
const TOKEN = /("[^"]*"|@media|\band\b|[{}();:])/;
const IS_TOKEN = /^("[^"]*"|@media|and|[{}();:])$/;

function colorFor(token: string) {
  if (token.startsWith('"')) return 'text-[#b5f07a]';
  if (token === '@media' || token === 'and') return 'text-[#ff8fb8]';
  if ('{}();:'.includes(token)) return 'text-white/45';
  return 'text-[#9ec5ff]';
}

export function CodeBlock({ code, fileName = 'agencia.css', className = '' }: { code: string; fileName?: string; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-3xl bg-ink shadow-float ${className}`}>
      <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-2.5">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="ml-2 font-mono text-xs text-white/50">{fileName}</span>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed text-white sm:text-sm">
        {code.split('\n').map((line, i) => (
          <div key={i}>
            {line.split(TOKEN).map((part, j) =>
              part ? (
                <span key={j} className={IS_TOKEN.test(part) ? colorFor(part) : 'text-white'}>
                  {part}
                </span>
              ) : null,
            )}
          </div>
        ))}
      </pre>
    </div>
  );
}
