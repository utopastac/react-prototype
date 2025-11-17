// Type declarations for SASS module imports

declare module '*.module.sass' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.sass' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

// Type declarations for SVG imports
declare module '*.svg' {
  const content: string;
  export default content;
}

