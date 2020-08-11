import * as chai from 'chai';
import { getDDFCsvReaderObject } from '../../src/index';
import {
  BASE_PATH,
  EMPTY_TRANSLATIONS_PATH,
  expectPromiseRejection,
  GLOBALIS_PATH,
  selectKeyClauseContainsUnavailableItems,
  selectKeyClauseMustHaveOnly1Item,
  selectValueClauseContainsUnavailableItems1,
  WS_TESTING_PATH
} from '../common';
import { RESERVED_CONCEPT, RESERVED_CONCEPT_TYPE, RESERVED_DOMAIN, RESERVED_DRILL_UP } from 'ddf-query-validator';
import { description, initData, testsDescriptors } from '../../src/test-cases/concepts';
import * as path from 'path';

const expect = chai.expect;

describe('Concepts definition errors in query', () => {
  describe(`Autogenerated tests for concepts`, () => {
    for (const testDescriptor of testsDescriptors[ description ]) {
      it(testDescriptor.itTitle, async () => {
        const reader = getDDFCsvReaderObject();
        let data;

        try {
          await reader.init(initData);
          data = await reader.read(testDescriptor.query);
        } catch (error) {
          throw error;
        }

        expect(data).to.not.null;
      });
    }
  });

  describe('should never happen for happy flow', () => {
    it(`when requests '${BASE_PATH + GLOBALIS_PATH}' dataset and 'ar-SA' language`, async () => {
      const reader = getDDFCsvReaderObject();

      reader.init({});

      const query = {
        repositoryPath: path.join(BASE_PATH, GLOBALIS_PATH, 'master-HEAD'),
        language: 'ar-SA',
        select: {
          key: [ 'concept' ],
          value: [
            'concept_type', 'name', 'description'
          ]
        },
        from: 'concepts',
        where: {
          $and: [
            { concept_type: { $eq: 'entity_set' } }
          ]
        },
        order_by: [ 'concept', { description: 'asc' } ]
      };
      const result = await reader.read(query);

      expect(result.length).to.be.equal(10);
    });

    it(`when requests only one column '${BASE_PATH + GLOBALIS_PATH}' dataset with no \'select.value\'`, async () => {
      const reader = getDDFCsvReaderObject();

      reader.init({});

      const query = {
        repositoryPath: path.join(BASE_PATH, GLOBALIS_PATH, 'master-HEAD'),
        select: {
          key: [ 'concept' ]
        },
        from: 'concepts',
        where: {},
        order_by: [ 'concept' ]
      };
      const result = await reader.read(query);

      expect(result.length).to.be.equal(592);
    });

    it(`when requests only one column '${BASE_PATH + GLOBALIS_PATH}' dataset with empty \'select.value\'`, async () => {
      const reader = getDDFCsvReaderObject();

      reader.init({});

      const query = {
        repositoryPath: path.join(BASE_PATH, GLOBALIS_PATH, 'master-HEAD'),
        select: {
          key: [ 'concept' ],
          value: []
        },
        from: 'concepts',
        where: {},
        order_by: [ 'concept' ]
      };
      const result = await reader.read(query);

      expect(result.length).to.be.equal(592);
    });

    it(`when requests \'${BASE_PATH + EMPTY_TRANSLATIONS_PATH}\' dataset without \'en\' language in datapackage.json`, async () => {
      const reader = getDDFCsvReaderObject();

      reader.init({});

      const query = {
        repositoryPath: path.join(BASE_PATH, EMPTY_TRANSLATIONS_PATH, 'master-HEAD'),
        from: 'concepts',
        language: 'en',
        select: {
          key: [ 'concept' ],
          value: [ 'concept_type', 'name' ]
        },
        where: {},
        dataset: EMPTY_TRANSLATIONS_PATH
      };
      const result = await reader.read(query);

      expect(result.length).to.equal(595);
    });
  });

  describe('should be produced only for \'select\' section', () => {

    it('when \'key\' property has item that is absent in dataset', async () => {
      const reader = getDDFCsvReaderObject();

      reader.init({ path: `${BASE_PATH}${WS_TESTING_PATH}/master-HEAD` });

      const query = {
        repositoryPath: `${BASE_PATH}${WS_TESTING_PATH}/master-HEAD`,
        select: {
          key: [ 'failed_concept' ],
          value: [ 'concept_type', 'name', 'domain' ]
        },
        from: 'concepts'
      };

      await expectPromiseRejection({
        promiseFunction: reader.read.bind(reader),
        args: [ query ],
        expectedErrors: [ selectKeyClauseContainsUnavailableItems ],
        type: 'definitions'
      });
    });

    it('when \'key\' property has many items (structure error)', async () => {
      const reader = getDDFCsvReaderObject();

      reader.init({});

      const query = {
        repositoryPath: `${BASE_PATH}${WS_TESTING_PATH}/master-HEAD`,
        from: 'concepts', select: { key: [ 'concept', 'failed_concept' ] }
      };

      await expectPromiseRejection({
        promiseFunction: reader.read.bind(reader),
        args: [ query ],
        expectedErrors: [ selectKeyClauseMustHaveOnly1Item ],
        type: 'structure'
      });
    });

    it('when debug mode and \'value\' property has items that is absent in dataset', async () => {
      const reader = getDDFCsvReaderObject();
      reader.init({});

      const query = {
        repositoryPath: `${BASE_PATH}${WS_TESTING_PATH}/master-HEAD`,
        from: 'concepts',
        debug: true,
        select: {
          key: [ 'concept' ],
          value: [ 'domain', 'failed_concept', 'company', 'name', 'lines_of_code', 'failed_concept2' ]
        }
      };

      await expectPromiseRejection({
        promiseFunction: reader.read.bind(reader),
        args: [ query ],
        expectedErrors: [ selectValueClauseContainsUnavailableItems1 ],
        type: 'definitions'
      });
    });

    it('when \'value\' property has items that is absent in dataset', async () => {
      const reader = getDDFCsvReaderObject();
      reader.init({});

      const query = {
        repositoryPath: `${BASE_PATH}${WS_TESTING_PATH}/master-HEAD`,
        from: 'concepts',
        select: {
          key: [ 'concept' ],
          value: [ 'domain', 'failed_concept', 'company', 'name', 'lines_of_code', 'failed_concept2' ]
        }
      };

      const result = await reader.read(query);
      expect(result).to.be.not.empty;
    });
  });
});
