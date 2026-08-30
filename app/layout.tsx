import './globals.css'; // 必要なら空ファイルでも OK

export const metadata = {
  title: '匿名掲示板',
  description: 'GitHub + Vercel で 1 クリックデプロイできる匿名掲示板',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
