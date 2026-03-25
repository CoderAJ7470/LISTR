// src/global.d.ts
declare module '*.scss' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.css'; // <--- this line allows plain CSS imports like Font Awesome
