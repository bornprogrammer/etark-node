import { ChainingMethodParamsEntity } from '@app/method-handler/ChainingMethodParamsEntity';
import { repositoryMethodHandlerIns } from '@app/method-handler/RepositoryMethodHandler';
import BaseRepository from '@app/repositories/BaseRepository';
import { questionModelIns } from './QuestionModel';

export class QuestionRepository extends BaseRepository {

    constructor() {
        super();
    }

    public addQuestion = async (params: ChainingMethodParamsEntity) => {
        const result = await repositoryMethodHandlerIns.setMethodHandler(questionModelIns.addQuestion).setParams(params.getTopParams()).get();
        return result;
    }

    public updateQuestion = async (params) => {
        const result = await repositoryMethodHandlerIns.setMethodHandler(questionModelIns.updateQuestion).setParams(params).get();
        return result;
    }

    public deleteQuestion = async (params) => {
        const result = await repositoryMethodHandlerIns.setMethodHandler(questionModelIns.deleteQuestion).setParams(params).get();
        return result;
    }

    public getQuestionFillers = async () => {
        const result = await repositoryMethodHandlerIns.setMethodHandler(questionModelIns.getQuestionFillers).get();
        return result;
    }

    public getQuestionList = async (params) => {
        const result = await repositoryMethodHandlerIns.setMethodHandler(questionModelIns.getQuestionList).setParams(params).get();
        return result;
    }

    public getQuestionWithMostVotedAnswers = async (chainingMethodParamsEntityParams: ChainingMethodParamsEntity) => {
        const params = chainingMethodParamsEntityParams.getTopParams();
        Object.assign(params, chainingMethodParamsEntityParams.getPreservedResultsContainerByIndex(0));
        Object.assign(params, chainingMethodParamsEntityParams.getPreservedResultsContainerByIndex(1));
        const result = await repositoryMethodHandlerIns.setMethodHandler(questionModelIns.getQuestionWithMostVotedAnswers).setParams(params).get();
        return result;
    }

    public getQuestionsFollowedByYou = async (chainingMethodParamsEntity: ChainingMethodParamsEntity) => {
        const params = chainingMethodParamsEntity.getTopParams();
        Object.assign(params, chainingMethodParamsEntity.getPreservedResultsContainerByIndex(0));
        const result = await repositoryMethodHandlerIns
        .setMethodHandler(questionModelIns.getQuestionsFollowedByYou).setParams(params).get();
        return result;
    }

    public getQuestionsOfTopicYouAreExpertIn = async (params) => {
        const result = await repositoryMethodHandlerIns.setMethodHandler(questionModelIns.getQuestionsOfTopicYouAreExpertIn).setParams(params).get();
        return result;
    }

    public disableQuestion = async (params) => {
        const result = await repositoryMethodHandlerIns.setMethodHandler(questionModelIns.disableQuestion).setParams(params).get();
        return result;
    }

    public enableQuestion = async (params) => {
        const result = await repositoryMethodHandlerIns.setMethodHandler(questionModelIns.enableQuestion).setParams(params).get();
        return result;
    }

    public getQuestionDetails = async (questionId: any) => {
        const result = await repositoryMethodHandlerIns.setMethodHandler(questionModelIns.getQuestionDetails).setParams(questionId).get();
        return result;
    }

    public askQuestion = async (data: any) => {
        const result = await repositoryMethodHandlerIns
            .setMethodHandler(questionModelIns.askQuestion)
            .setParams(data).get();
        return result;
    }

    public getIrrelevantCountByQuestionId = async (chainingMethodParamsEntity: ChainingMethodParamsEntity) => {
        const params = chainingMethodParamsEntity.getTopParams();
        Object.assign(params, chainingMethodParamsEntity.getPreservedResultsContainerByIndex(0));
        const result = await repositoryMethodHandlerIns.setMethodHandler(questionModelIns.getIrrelevantCountByQuestionId).setParams(params).get();
        return result;
    }

    public getUnAnsweredQuestionCount = async () => {
        const result = await repositoryMethodHandlerIns
            .setMethodHandler(questionModelIns.getUnAnsweredQuestionCount).get();
        return result;
    }

    public getMostResponsedQuestion = async (chainingMethodParamsEntity: ChainingMethodParamsEntity) => {
        const result = await repositoryMethodHandlerIns
            .setMethodHandler(questionModelIns.getMostResponsedQuestion).get();
        return result;
    }
}

export const questionRepositoryIns = new QuestionRepository();
