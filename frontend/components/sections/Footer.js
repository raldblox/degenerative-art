export const Footer = () => {
  return (
    <footer className="p-6 space-y-6">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <h1 className="text-xs text-center md:text-left text-default-700 text-balance">
          Copyright © 2024 Degeneratives. All rights reserved.
        </h1>
        <h1 className="row-start-1 text-xs text-center md:col-start-2 text-default-700 text-balance md:text-right">
          Made with 💚 for Degens
        </h1>
      </div>
    </footer>
  );
};
