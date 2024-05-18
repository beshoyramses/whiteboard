import { SelectedToolProvider } from "../components/context/SelectedTool";
import { SelectedColorProvider } from "../components/context/Color";

export const metadata = {
  title: 'Next.js',
  description: 'Generated by Next.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SelectedToolProvider>
          <SelectedColorProvider>
            {children}
          </SelectedColorProvider>
        </SelectedToolProvider>
      </body>
    </html>
  );
}
