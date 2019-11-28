import { repositoryMethodHandlerIns } from '@app/method-handler/RepositoryMethodHandler';
import BaseRepository from '@app/repositories/BaseRepository';
import { answerModelIns } from './AnswerModel';
import { ChainingMethodParamsEntity } from '@app/method-handler/ChainingMethodParamsEntity';
import { IEntity } from '../IEntity';

export class AnswerRepository extends BaseRepository {

    constructor() {
        super();
    }

    public addAnswer = async (chainingMethodParamsEntity: ChainingMethodParamsEntity) => {
        const result = await repositoryMethodHandlerIns.setMethodHandler(answerModelIns.addAnswer).setParams(chainingMethodParamsEntity.getTopParams()).get();
        return result;
    }

    public updateAnswer = async (params) => {
        const result = await repositoryMethodHandlerIns.setMethodHandler(answerModelIns.updateAnswer).setParams(params).get();
        return result;
    }

    public deleteAnswer = async (params) => {
        const result = await repositoryMethodHandlerIns.setMethodHandler(answerModelIns.deleteAnswer).setParams(params).get();
        return result;
    }

    public getAnswerList = async (chainingMethodParamsEntity: ChainingMethodParamsEntity) => {
        const params = chainingMethodParamsEntity.getTopParams();
        Object.assign(params, chainingMethodParamsEntity.getPreservedResultsContainerByIndex(0));
        Object.assign(params, chainingMethodParamsEntity.getPreservedResultsContainerByIndex(1));
        Object.assign(params, chainingMethodParamsEntity.getPreservedResultsContainerByIndex(2));
        const result = await repositoryMethodHandlerIns.setMethodHandler(answerModelIns.getAnswerList).setParams(params).get();
        return result;
    }

    public getAnswersGivenByYou = async (chainingMethodParamsEntity: ChainingMethodParamsEntity) => {
        const params = chainingMethodParamsEntity.getTopParams();
        Object.assign(params, chainingMethodParamsEntity.getPreservedResultsContainerByIndex(0));
        const result = await repositoryMethodHandlerIns.setMethodHandler(answerModelIns.getAnswersGivenByYou).setParams(params).get();
        return result;
    }

    public getAnswerNQuestionByQuestionId = async (chainingMethodParamsEntity: ChainingMethodParamsEntity) => {
        const params = chainingMethodParamsEntity.getTopParams();
        Object.assign(params, chainingMethodParamsEntity.getPreservedResultsContainerByIndex(0));
        Object.assign(params, chainingMethodParamsEntity.getPreservedResultsContainerByIndex(1));
        const result = await repositoryMethodHandlerIns.setMethodHandler(answerModelIns.getAnswerNQuestionByQuestionId).setParams(params).get();
        return result;
    }

    public disableAnswer = async (params) => {
        const result = await repositoryMethodHandlerIns.setMethodHandler(answerModelIns.disableAnswer).setParams(params).get();
        return result;
    }

    public enableAnswer = async (params) => {
        const result = await repositoryMethodHandlerIns.setMethodHandler(answerModelIns.enableAnswer).setParams(params).get();
        return result;
    }

    public getIrrelevantCountByAnsId = async (chainingMethodParamsEntity: ChainingMethodParamsEntity) => {
        const params = chainingMethodParamsEntity.getTopParams();
        Object.assign(params, chainingMethodParamsEntity.getPreservedResultsContainerByIndex(0));
        const result = await repositoryMethodHandlerIns.setMethodHandler(answerModelIns.getIrrelevantCountByAnsId).setParams(params).get();
        return result;
    }

    public getAnswerDetailsByAnswerId = async (answerId) => {
        const result = await repositoryMethodHandlerIns.setMethodHandler(answerModelIns.getAnswerDetailsByAnswerId).setParams(answerId).get();
        return result;
    }

    public getUserDetailsWhoUpvotedAnswer = async (params) => {
        const result = await repositoryMethodHandlerIns.setMethodHandler(answerModelIns.getUserDetailsWhoUpvotedAnswer).setParams(params).get();
        return result;
    }

}

export const answerRepositoryIns = new AnswerRepository();
