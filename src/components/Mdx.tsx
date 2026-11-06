import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import React from "react";
import Link from "next/link";
import CodeBlock from "./CodeBlock";
import Callout from "./Callout";
import Mermaid from "./Mermaid";
import MdxImage from "./MdxImage";

// Custom Link Component
interface CustomLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string;
}

const CustomLink = ({ href, children, ...props }: CustomLinkProps) => {
  const isInternal = href && (href.startsWith("/") || href.startsWith("#"));

  if (isInternal) {
    return (
      <Link href={href} {...props} className="text-sky-400 hover:text-sky-300 underline underline-offset-4 decoration-slate-800 hover:decoration-sky-400 transition-colors">
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-sky-400 hover:text-sky-300 underline underline-offset-4 decoration-slate-800 hover:decoration-sky-400 transition-colors"
      {...props}
    >
      {children}
    </a>
  );
};

// Custom components map
const components = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="text-3xl font-extrabold mt-12 mb-5 border-b border-slate-800 pb-3 tracking-tight text-slate-100" {...props} />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="text-2xl font-bold mt-12 mb-5 pb-2.5 border-b border-slate-800/80 tracking-tight text-slate-100 flex items-center justify-between" {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="text-lg font-bold mt-8 mb-3 tracking-tight text-slate-200" {...props} />
  ),
  h4: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4 className="text-base font-semibold mt-6 mb-2 text-slate-300 font-mono" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="my-5 text-slate-300 leading-relaxed" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="list-disc pl-6 my-5 space-y-2 text-slate-300" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="list-decimal pl-6 my-5 space-y-2 text-slate-300" {...props} />
  ),
  li: (props: React.LiHTMLAttributes<HTMLLIElement>) => (
    <li className="text-slate-300 leading-relaxed" {...props} />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className="border-l-2 border-sky-400 border-t border-r border-b border-slate-800/80 pl-5 pr-4 py-3.5 my-8 text-slate-300 bg-slate-950/40 font-mono text-sm leading-relaxed" {...props} />
  ),
  table: (props: React.TableHTMLAttributes<HTMLTableElement>) => (
    <div className="overflow-x-auto my-8 border border-slate-800 bg-slate-950/30">
      <table className="min-w-full divide-y divide-slate-800 text-sm font-sans" {...props} />
    </div>
  ),
  thead: (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead className="bg-slate-900/80 text-slate-200 font-mono text-xs uppercase tracking-wider border-b border-slate-800" {...props} />
  ),
  tbody: (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <tbody className="divide-y divide-slate-800/40 text-slate-300" {...props} />
  ),
  tr: (props: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr className="hover:bg-slate-900/40 transition-colors" {...props} />
  ),
  th: (props: React.ThHTMLAttributes<HTMLTableCellElement>) => (
    <th className="px-4 py-3 text-left font-mono font-bold text-slate-300" {...props} />
  ),
  td: (props: React.TdHTMLAttributes<HTMLTableCellElement>) => (
    <td className="px-4 py-3 font-mono text-xs text-slate-300 border-b border-slate-800/40" {...props} />
  ),
  hr: (props: React.HTMLAttributes<HTMLHRElement>) => (
    <hr className="my-10 border-slate-800" {...props} />
  ),
  figure: (props: React.HTMLAttributes<HTMLElement>) => {
    const childrenArray = React.Children.toArray(props.children) as React.ReactElement[];
    
    // Find custom title div injected by rehype-pretty-code
    const titleNode = childrenArray.find(
      (child) => child && child.props && (child.props as Record<string, unknown>)["data-rehype-pretty-code-title"] !== undefined
    );
    
    // Find pre-formatted code block
    const preNode = childrenArray.find(
      (child) => child && (child.type === "pre" || (child.props && (child.props as Record<string, unknown>)["data-language"] !== undefined))
    ) as React.ReactElement<Record<string, unknown>> | undefined;

    if (preNode) {
      const titleText = titleNode ? (titleNode.props as { children?: React.ReactNode }).children : undefined;
      return React.cloneElement(preNode, { title: titleText, ...preNode.props });
    }

    return <figure {...props} />;
  },
  div: (props: React.HTMLAttributes<HTMLDivElement>) => {
    // Hide standard title element since it's already integrated inside our CodeBlock header
    if ((props as Record<string, unknown>)["data-rehype-pretty-code-title"] !== undefined) {
      return null;
    }
    return <div {...props} />;
  },
  a: CustomLink,
  pre: CodeBlock,
  Callout,
  Mermaid,
  img: MdxImage,
  Image: MdxImage,
};

// Custom MDX Tree Node interface for the remark plugin
interface MdxNode {
  type: string;
  lang?: string;
  value?: string;
  name?: string;
  attributes?: Array<{
    type: string;
    name: string;
    value?: string;
  }>;
  children?: MdxNode[];
}

// Remark plugin to convert mermaid blocks to <Mermaid chart="..." />
const remarkMermaid = () => {
  return (tree: MdxNode) => {
    const visit = (node: MdxNode) => {
      if (node.type === "code" && node.lang === "mermaid") {
        node.type = "mdxJsxFlowElement";
        node.name = "Mermaid";
        node.attributes = [
          {
            type: "mdxJsxAttribute",
            name: "chart",
            value: node.value,
          },
        ];
      }
      if (node.children) {
        node.children.forEach(visit);
      }
    };
    visit(tree);
  };
};

const customMutedTheme = {
  name: "custom-muted",
  type: "dark",
  colors: {
    "editor.background": "#181818",
    "editor.foreground": "#F2F2F2",
  },
  tokenColors: [
    {
      scope: [
        "keyword",
        "storage.type",
        "storage.modifier",
        "constant.language",
        "variable.language.this",
      ],
      settings: {
        foreground: "#CF7253",
      },
    },
    {
      scope: [
        "string",
        "string.regexp",
        "punctuation.definition.string",
      ],
      settings: {
        foreground: "#85C995",
      },
    },
    {
      scope: [
        "comment",
        "punctuation.definition.comment",
      ],
      settings: {
        foreground: "#6A737D",
      },
    },
    {
      scope: [
        "entity.name.function",
        "support.function",
        "variable.function",
      ],
      settings: {
        foreground: "#E2D2B2", // warm cream
      },
    },
    {
      scope: [
        "variable",
        "variable.parameter",
        "variable.other",
        "support.type",
        "support.class",
        "punctuation",
        "meta.brace",
      ],
      settings: {
        foreground: "#F2F2F2",
      },
    },
    {
      scope: [
        "constant.numeric",
        "constant.character",
        "constant.other",
      ],
      settings: {
        foreground: "#F0B44C", // soft warning amber/yellow for numbers
      },
    },
  ],
};

interface MdxProps {
  source: string;
}

export default function Mdx({ source }: MdxProps) {
  return (
    <MDXRemote
      source={source}
      components={components}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm, remarkMermaid],
          rehypePlugins: [
            rehypeSlug,
            [
              rehypeAutolinkHeadings,
              {
                behavior: "wrap",
                properties: {
                  className: ["subtle-anchor"],
                },
              },
            ],
            [
              rehypePrettyCode,
              {
                theme: customMutedTheme,
                keepBackground: false,
              },
            ],
          ],
        },
      }}
    />
  );
}
