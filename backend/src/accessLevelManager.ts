interface AccessRequirements {
    [key: string]: {
      [key: string]: number;
    };
  }

export default class AccessLevelManager {
    private static ACCESS_LEVEL_REQUIREMENTS: AccessRequirements = {
      realms: {
        get: 1,
        set: 3,
        update: 3,
        delete: 99,
      },
      menu: {
        get: 1,
        set: 2,
        update: 2,
        delete: 3,
      },
    };
  
    public static getAccessLevelRequirement(name: string, requestType: string): number | undefined {
      const requirements = AccessLevelManager.ACCESS_LEVEL_REQUIREMENTS[name];
  
      if (requirements && requirements[requestType]) {
        return requirements[requestType];
      }
  
      return undefined;
    }
  }