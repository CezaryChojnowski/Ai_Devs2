export default interface Function<T> {
    name: string;
    description: string;
    parameters: {
      type: string;
      properties: T;
    };
}