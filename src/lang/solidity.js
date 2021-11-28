// ----------------------------------------------------------------------
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
// --
// Copyright 2016-2018 Andi Dittrich <https://andidittrich.de>
// Added syntax for Solidity by Alex Muratov
// ----------------------------------------------------------------------

// Generic Rules/Regex
import _language_common_rules from './rulesets/generic';
import {generic} from './generic';

import _token from '../engine/token';
import _microTokenizer from '../engine/micro-tokenizer';

// Solidity Language Pattern
// Author: [Alex Muratov, 2021]
// --
export class javascript extends generic{

    // language aliases
    static alias(){
        return ['js'];
    }

    setupLanguage(){
        // escape sequences within strings. Stage-2 Analyzing
        function parseEscapeSeq(token){

            // run the MicroTokenizer to process escape sequences
            return _microTokenizer(token, /\\(x[A-F0-9]{2}|u[A-F0-9]{4}|.)/gi, function(match){
                // single escape sequence token
                return [_token(match[0], 's4')];
            });
        }

        // template strings. Stage-2 Analyzing
        function parseTemplateSeq(token){

            // run the MicroTokenizer to identify the template tags
            return _microTokenizer(token, /\$\{.*?}/g, function(match){
                return [_token(match[0], 's3')];
            });
        }

        this.rules = [

            // strings
            {
                regex: _language_common_rules.sqStrings.regex,
                type: 's0',
                filter: parseEscapeSeq
            },

            // strings
            {
                regex: _language_common_rules.dqStrings.regex,
                type: 's0',
                filter: parseEscapeSeq
            },

            // template strings
            {
                regex: /`(?:[^`\\]|\\.)*`/g,
                type: 's2',
                filter: parseTemplateSeq
            },

            // boolean expression
            _language_common_rules.boolean,

            // null expression
            _language_common_rules.null,

            // properties - render before keywords!
            _language_common_rules.prop,

            // variable type/initializations
            {
                regex: /\b(enum|memory|storage|calldata|pure|view|payable|address)\b/g,
                type: 'k2'
            },

            // global object keywords
            {
                regex: /\b(abi|block|msg|now|tx|assert|require|revert|blockhash|keccak256|sha256|ripemd160|ecrecover)\b/g,
                type: 'k9'
            },

            // control keywords
            {
                regex: /\b(if|while|else|do|continue|break|return|throw|emit)\b/g,
                type: 'k1'
            },

            // keywords
            {
                regex: /\b(import|contract|library|interface|is|public|internal|private|constant|using|struct|function|external|public|internal|private|event|anonymous|assembly|selfdestruct|true|false)\b/g,
                type: 'k0'
            },

            // special inheritance
            {
                regex: /\b(super|this)\b/g,
                type: 'k9'
            },

            // operator
            {
                regex: /\b(instanceof|new|delete|typeof|void|in)\b/g,
                type: 'k3'
            },

            // special operators
            {
                regex: /\b(wei|szabo|finney|ether)\b/g,
                type: 'k3'
            },


            // slash style comments
            _language_common_rules.slashComments,

            // multi line comments
            _language_common_rules.blockComments,

            // regular expressions
            {
                regex: /\W(\/(?:[^/\\]|\\.)*\/\w*)/g,
                type: 'e2'
            },

            // method calls
            _language_common_rules.mCalls,

            // global function calls
            _language_common_rules.fCalls,

            // brackets
            {
                regex: /\{|}|\(|\)|\[|]/g,
                type: 'g1'
            },

            // octals
            {
                regex: /[\b\W](-?0o[0-7]+)(?!\.)\b/g,
                type: 'n4'
            },

            // bin
            _language_common_rules.bin,

            // hex
            _language_common_rules.hex,

            // floats/integer numbers
            _language_common_rules.floats,

            // integers
            _language_common_rules.int

        ];
    }
}
