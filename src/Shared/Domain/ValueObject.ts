export default abstract class ValueObject<Properties> {
  public properties: Properties;

  constructor(properties: Properties) {
    this.properties = properties;

    Object.freeze(this);
  }
}
