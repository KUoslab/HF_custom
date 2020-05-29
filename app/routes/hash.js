/*
*
*  *****************************************************************************************************
*   Copyright 2020 Korea University 
*
*   Licensed under the Apache License, Version 2.0 (the "License");
*   you may not use this file except in compliance with the License.
*   You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
*   Unless required by applicable law or agreed to in writing, software
*   distributed under the License is distributed on an "AS IS" BASIS,
*   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*   See the License for the specific language governing permissions and
*   limitations under the License.
*   *****************************************************************************************************
*   Developed by Kwanhoon Lee, Jaemin Im, Stella team, Operating Systems Lab of Korea University
*   *****************************************************************************************************
*
*/
var crypto = require('crypto');

module.exports = {
    getHash: function(text){
        var shasum = crypto.createHash('sha1');
        shasum.update(text);
        var output = shasum.digest('hex');
    
        return output
    }
}


