import { IUser } from 'app/core/user/user.model';
import { Units } from 'app/shared/model/enumerations/units.model';

export interface IPreferences {
  id?: number;
  weeklyGoal?: number;
  weightUnits?: Units;
  user?: IUser;
}

export class Preferences implements IPreferences {
  constructor(public id?: number, public weeklyGoal?: number, public weightUnits?: Units, public user?: IUser) {}
}
