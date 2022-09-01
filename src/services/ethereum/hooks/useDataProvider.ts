import { DataProvider } from '../data-provider';
import { useEthereum } from './useEthereum';

export const useDataProvider = <T = DataProvider>(
  sel: { (data: DataProvider): T } = (x) => x as unknown as T,
) => {
  const data = useEthereum(({ dataProvider }) => dataProvider);

  return sel(data);
};
