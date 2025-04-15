export class AnalogInput {
  private keys: Map<string, number> = new Map();
  private isConnected: boolean = false;

  constructor() {
    // Initialize all keys at 0%
    this.keys.set("W", 0);
    this.keys.set("A", 0);
    this.keys.set("S", 0);
    this.keys.set("D", 0);
    this.keys.set("Space", 0);
  }

  public async initExisting(): Promise<boolean> {
    // try initting from already paired devices. If there are none, this returns false so we can handle it on the scene

    //@ts-expect-error analogsense gets imported from a script tag
    const savedDevices = await analogsense.getDevices();
    if (savedDevices.length === 0) {
      console.log("No saved devices found");
      return false;
    }

    this.handleDeviceAdded(savedDevices[0]);

    return true;
  }

  public async initNew(): Promise<boolean> {
    //@ts-expect-error analogsense gets imported from a script tag
    const device = await analogsense.requestDevice();

    if (device === undefined) {
      console.error("No devices found");
      return false;
    }

    console.log("Found new devices:", device);

    this.handleDeviceAdded(device);

    return true;
  }

  handleDeviceAdded(device: any): void {
    device.startListening((active_keys: any[]) => {
      if (active_keys.length === 0) {
        for (const key of this.keys.keys()) {
          this.updateKeyValue(key, 0);
        }
        return;
      }
      for (const { scancode, value } of active_keys) {
        //@ts-expect-error analogsense gets imported from a script tag
        const str = analogsense.scancodeToString(scancode);
        this.updateKeyValue(str, value * 100);
        console.debug(`Key: ${scancode}, Value: ${value}, ${str}`);
      }
    });

    this.isConnected = true;
  }

  // Check if analog keyboard is connected
  public isKeyboardConnected(): boolean {
    return this.isConnected;
  }

  // Hardware implementation would call this to update key values
  public updateKeyValue(key: string, value: number): void {
    // Update with new value (0-100%)
    const clampedValue = Math.max(0, Math.min(100, value));
    this.keys.set(key, clampedValue);
  }

  public getKeyValue(key: string): number {
    return this.keys.get(key) || 0;
  }
}
