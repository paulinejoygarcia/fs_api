import { Meteor } from 'meteor/meteor';
import { FilesCollection } from 'meteor/ostrio:files';

let Avatar = new FilesCollection({
    debug: false,
    collectionName: 'avatars',
    permissions: 0774,
    parentDirPermissions: 0774,
    allowClientCode: true,
    storagePath: Meteor.settings.public.config.files,
    onBeforeUpload: function (file) {
        if (/png|jpe?g/i.test(file.extension || '')) {
            return true;
        }
        return 'File type is not accepted!';
    },
    onAfterUpload:function(fileReference){
        if (/png|jpe?g/i.test(fileReference.extension || '') && Meteor.isServer) {
            import {createThumbnails} from './imageprocessing.js';
            createThumbnails(this, fileReference, 200,Meteor.bindEnvironment((error,fileRef) => {
                if (error)
                    console.error(error);
            }));
        }
    }
});
if(Meteor.isServer){
    Avatar.allowClient();
    Meteor.publish('avatars.files.all', function () {
        return Avatar.find().cursor;
    });
}
export {Avatar}