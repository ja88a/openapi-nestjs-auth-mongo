import { Injectable } from '@nestjs/common';
import { isPointWithinRadius } from 'geolib';
import { IHelperGeoCurrent, IHelperGeoRules } from '../helper.interface';

@Injectable()
export class HelperGeoService {
    inRadius(geoRule: IHelperGeoRules, geoCurrent: IHelperGeoCurrent): boolean {
        return isPointWithinRadius(
            { latitude: geoRule.latitude, longitude: geoRule.longitude },
            geoCurrent,
            geoRule.radiusInMeters
        );
    }
}
