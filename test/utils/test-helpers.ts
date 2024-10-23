import fs from 'fs';

export const createAuthorizationHeader = (
  username?: string,
  password?: string,
) => {
  const credentials = btoa(`${username}:${password}`);

  return {
    Authorization: `Basic ${credentials}`,
  };
};

export const createBearerAuthorizationHeader = (token?: string) => {
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const TOKEN_PATH = './test/utils/tokens.json';

export const readFileSync = (
  filePath: string,
  options?:
    | {
        encoding: BufferEncoding;
        flag?: string;
      }
    | BufferEncoding,
) => {
  return JSON.parse(fs.readFileSync(filePath, options || 'utf8'));
};

export const writeFileSync = (filePath: string, data: unknown) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2)); // добавим отступы для удобного чтения
};

export const addDataToFile = (
  filePath: string,
  newData: Record<string, unknown>,
) => {
  let existingData: Array<Record<string, unknown>> = [];

  try {
    // Пытаемся прочитать существующие данные
    existingData = readFileSync(filePath);
  } catch (error) {
    // Если файл не найден, создаем новый с пустым массивом
    if (error.code === 'ENOENT') {
      console.log(`Файл не найден, создаем новый: ${filePath}`);
    } else {
      console.error('Ошибка при чтении файла:', error);
      return;
    }
  }

  // Проверяем, что данные из файла — это массив, иначе инициализируем массивом
  if (!Array.isArray(existingData)) {
    existingData = [];
  }

  // Добавляем новые данные в массив
  existingData.push(newData);

  // Записываем обновленные данные обратно в файл
  writeFileSync(filePath, existingData);
};
