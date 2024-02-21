//> using scala 3.3.1
//> using dep "org.typelevel::laika-core::1.0.0"

import laika.api._
import laika.format._
import laika.config.SyntaxHighlighting

val transformer = Transformer
  .from(Markdown)
  .to(HTML)
  .using(Markdown.GitHubFlavor)
  .using(SyntaxHighlighting)
  .build

val md = """# Hello, Laika!

```scala
//> using scala 3.3.1
//> using dep "org.typelevel::laika-core::1.0.0"

import laika.api._
import laika.format._

val transformer = Transformer
  .from(Markdown)
  .to(HTML)
  .build
```
"""

val result = transformer.transform(md)

println(result.right.get)