assert-equal-html
===

Assert the equality of two HTML fragments

---

The comparison rules are as follows:

- The DOCTYPE, if present, is ignored
- HTML comments are also ignored
- Attributes and class names are sorted
- ASCII whitespace is stripped and collapsed

> [ASCII whitespace][1] is U+0009 TAB, U+000A LF, U+000C FF, U+000D CR, or U+0020 SPACE.
>
> To [strip and collapse ASCII whitespace][2] in a string, replace any sequence of one or more
> consecutive code points that are ASCII whitespace in the string with a single U+0020 SPACE
> code point, and then remove any leading and trailing ASCII whitespace from that string.

[1]: https://infra.spec.whatwg.org/#ascii-whitespace
[2]: https://infra.spec.whatwg.org/#strip-and-collapse-ascii-whitespace
