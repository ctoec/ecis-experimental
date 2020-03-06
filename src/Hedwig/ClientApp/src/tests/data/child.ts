import { Child, Gender } from '../../generated';
import emptyGuid from '../../utils/emptyGuid';

export const mockChild: Child = {
	id: emptyGuid(),
	firstName: 'Lily',
	middleName: 'Luna',
	lastName: 'Potter',
	birthdate: new Date('2016-12-12'),
	birthTown: 'Hogsmeade',
	birthState: 'CT',
	birthCertificateId: '123',
	nativeHawaiianOrPacificIslander: true,
	hispanicOrLatinxEthnicity: true,
	gender: Gender.Female,
	foster: false,
	familyId: 1,
	organizationId: 1,
	family: {
		id: 1,
		addressLine1: '4 Privet Drive',
		town: 'Hogsmeade',
		state: 'CT',
		zip: '77777',
		homelessness: false,
		organizationId: 1,
		determinations: [{ id: 1, notDisclosed: true, familyId: 1 }],
	},
};
