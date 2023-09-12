/**
 * External dependencies
 */
import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

/**
 * Internal dependencies
 */
import AlignmentMatrixControl from '..';

const getControl = () => {
	return screen.getByRole( 'grid' );
};

const getCell = ( name: string ) => {
	return within( getControl() ).getByRole( 'gridcell', { name } );
};

const asyncRender = async ( jsx: any ) => {
	const view = render( jsx );
	await act( async () => {
		// This allows the component to properly establish
		// its initial state, that sometimes isn't otherwise
		// ready in time for tests to start.
		await new Promise( requestAnimationFrame );
		await new Promise( requestAnimationFrame );
		await new Promise( requestAnimationFrame );
	} );
	return view;
};

describe( 'AlignmentMatrixControl', () => {
	describe( 'Basic rendering', () => {
		it( 'should render', async () => {
			await asyncRender( <AlignmentMatrixControl /> );

			expect( getControl() ).toBeInTheDocument();
		} );

		it( 'should be centered by default', async () => {
			const user = userEvent.setup();

			await asyncRender( <AlignmentMatrixControl /> );

			await user.tab();

			expect( getCell( 'center center' ) ).toHaveFocus();
		} );
	} );

	describe( 'Should change value', () => {
		describe( 'with Mouse', () => {
			describe( 'on cell click', () => {
				it.each( [
					'top left',
					'top center',
					'top right',
					'center left',
					'center center',
					'center right',
					'bottom left',
					'bottom center',
					'bottom right',
				] )( '%s', async ( alignment ) => {
					const user = userEvent.setup();
					const spy = jest.fn();

					await asyncRender(
						<AlignmentMatrixControl
							value="center"
							onChange={ spy }
						/>
					);

					await user.click( getCell( alignment ) );

					expect( getCell( alignment ) ).toHaveFocus();
					expect( spy ).toHaveBeenCalledWith( alignment );
				} );
			} );
		} );

		describe( 'with Keyboard', () => {
			describe( 'on arrow press', () => {
				it.each( [
					[ 'ArrowUp', 'top center' ],
					[ 'ArrowLeft', 'center left' ],
					[ 'ArrowDown', 'bottom center' ],
					[ 'ArrowRight', 'center right' ],
				] )( '%s', async ( keyRef, cellRef ) => {
					const user = userEvent.setup();
					const spy = jest.fn();

					await asyncRender(
						<AlignmentMatrixControl onChange={ spy } />
					);

					await user.tab();
					await user.keyboard( `[${ keyRef }]` );

					expect( getCell( cellRef ) ).toHaveFocus();
					expect( spy ).toHaveBeenCalledWith( cellRef );
				} );
			} );

			describe( 'but not at at edge', () => {
				it.each( [
					[ 'ArrowUp', 'top left' ],
					[ 'ArrowLeft', 'top left' ],
					[ 'ArrowDown', 'bottom right' ],
					[ 'ArrowRight', 'bottom right' ],
				] )( '%s', async ( keyRef, cellRef ) => {
					const user = userEvent.setup();
					const spy = jest.fn();

					await asyncRender(
						<AlignmentMatrixControl onChange={ spy } />
					);

					const cell = getCell( cellRef );
					await user.click( cell );
					await user.keyboard( `[${ keyRef }]` );

					expect( cell ).toHaveFocus();
					expect( spy ).toHaveBeenCalledWith( cellRef );
				} );
			} );
		} );
	} );
} );
