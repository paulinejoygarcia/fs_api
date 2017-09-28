import { Meteor } from 'meteor/meteor';
import { FilesCollection } from 'meteor/ostrio:files';

let Avatar = new FilesCollection({
    debug: false,
    collectionName: 'avatars',
    permissions: 0774,
    parentDirPermissions: 0774,
    allowClientCode: true,
    storagePath: '/data/uploads/',
    onBeforeUpload: function (file) {
        if (!/png|jpe?g/i.test(file.extension || ''))
            return 'File type is not accepted!';
        return true;
    },
    onAfterUpload:function(fileReference){
        if (/png|jpe?g/i.test(fileReference.extension || '') && Meteor.isServer) {
            import {createThumbnails} from './imageprocessing.js';
            createThumbnails(this, fileReference, 200,Meteor.bindEnvironment((error,fileRef) => {
                if (error)
                    console.error(error);
                else
                    console.log("image thumbnail created!");
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