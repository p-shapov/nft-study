import { DataProvider } from '../data-provider';
import { useStore } from './useStore';

export const useDataProvider = <T = DataProvider>(
  sel: { (data: DataProvider): T } = (x) => x as unknown as T,
) => {
  const data = useStore(({ dataProvider }) => dataProvider);

  return sel(data);
};
