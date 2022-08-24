class ProvidedError extends Error {
  constructor(name?: string, message?: string) {
    super(message);
    this.name = name || 'ProvidedError';
  }
}

export const provideError = <T extends Error>(error: T | null) => {
  if (error) throw new ProvidedError(error.name, error.message);
};
