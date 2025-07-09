// 環境判定用ユーティリティ

export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';
export const isTest = process.env.NODE_ENV === 'test';

export const getEnvironment = () => {
  if (isDevelopment) return 'development';
  if (isProduction) return 'production';
  if (isTest) return 'test';
  return 'unknown';
};

export const getDatabaseUrl = () => {
  return process.env.DATABASE_URL || 'file:./dev.db';
};

export const getPrismaSchemaPath = () => {
  if (isProduction) {
    return './prisma/schema.production.prisma';
  }
  return './prisma/schema.development.prisma';
};

// 環境情報をログ出力
export const logEnvironment = () => {
  console.log('🔍 環境情報:');
  console.log(`  NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`  環境: ${getEnvironment()}`);
  console.log(`  データベース: ${isProduction ? 'PostgreSQL' : 'SQLite'}`);
  console.log(`  DATABASE_URL: ${getDatabaseUrl().substring(0, 30)}...`);
}; 