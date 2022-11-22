import { HandlerTools, Repository } from "@iote/cqrs";
import { Query } from "@ngfi/firestore-qbuilder";
import { Message, IncomingMessage } from '@app/model/convs-mgr/conversations/messages';
// import { CommunicationChannel } from "@app/model/bot/channel";

export abstract class BotDataService<T> {
    private repo$: Repository<T>

    constructor(private _tools: HandlerTools){}

    /** Initialization function for all Child classes
     *  Sets the firestore document path and the message property
     */
   //  protected abstract _init(...args: (CommunicationChannel | Message | IncomingMessage)[]): void;

    async getDocumentById(id: string, path: string){
       this.repo$ =  this._tools.getRepository<T>(path)

       const doc = await this.repo$.getDocumentById(id)
       return doc
    }

    async getDocuments(path: string){
        this.repo$ =  this._tools.getRepository<T>(path)
 
        return await this.repo$.getDocuments(new Query())
     }

     async getDocumentByField(field: string, value: string, path: string){
        this.repo$ =  this._tools.getRepository<T>(path)
 
        const doc = await this.repo$.getDocuments(new Query().where(field, '==', value))
        return doc
     }

     async createDocument(doc: T, path: string, id?: string){
        this.repo$ =  this._tools.getRepository<T>(path)

        return await this.repo$.create(doc, id)
     }

     async getLatestDocument(path: string){
        this.repo$ =  this._tools.getRepository<T>(path)
 
        return await this.repo$.getDocuments(new Query().orderBy('createdOn', 'desc').limit(1));
     }
}