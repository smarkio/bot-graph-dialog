
import { ILuisModel, LuisModel, IIntentScore, IntentScore } from './Luis';
import * as request from 'request-promise';
import * as Promise from 'bluebird';
import * as _ from 'underscore';

export interface IIntentScorer {
  collectIntents(models: ILuisModel[], text: string, threashold: number): Promise<IIntentScore[]>;
}

/**
 * Score intents from a single or multiple intent scoring APIs
 */
export class IntentScorer implements IIntentScorer {

	 public collectIntents(models: ILuisModel[], text: string, threashold: number = 0): Promise<any> {

			let promises: Promise<any>[] = models.map(model => {
				return this.scoreIntent(model, text, threashold);
			});

			return new Promise(function (resolve, reject) {
				if (!models) return reject('Please provide models array');
				if (!text) return reject('Please provide text');

				Promise.all(promises)
					.then(intents => {
						var sortedIntents = _.sortBy(_.compact(intents), 'score').reverse();
						sortedIntents = _.filter(sortedIntents, intent => intent.intent != 'None');
						resolve(sortedIntents);
					})
					.catch(reject);
			});  
	 }

	 private scoreIntent(model: ILuisModel, text: string, threashold: number = 0): Promise<any> {
		 return new Promise(function (resolve, reject) {
			 return request(model.url + encodeURIComponent(text))
				.then(result => {
					let json = JSON.parse(result);
					if (!json || !json.intents || !json.intents.length) return resolve();

					// In case when minumum score is required, enforce minimum score
					if (json.intents[0].score < threashold) return resolve();

					let intent = json.intents[0];
					intent.model = model.name;

					return resolve(<IIntentScore>intent);
				})
				.catch(reject);
		});
		}

}

