// import * as anchor from '@coral-xyz/anchor';
// import { Program } from '@coral-xyz/anchor';
// import { AnchorEscrow } from '../target/types/anchor_escrow';
// import { assert } from 'chai';
// import loadKeypairFromFile from './phanuel/lib/loadKeypairFromFile';

// describe('phanuel', () => {
//     // Configure the client to use the local cluster.
//     anchor.setProvider(anchor.AnchorProvider.env());

//     const program = anchor.workspace.AnchorEscrow as Program<AnchorEscrow>;
//     const systemProgram = anchor.web3.SystemProgram;
//     const admin = anchor.workspace.AnchorEscrow.provider.wallet.payer as anchor.web3.Keypair;
//     const w1 = loadKeypairFromFile('./tests/w1.json');
//     const w2 = loadKeypairFromFile('./tests/w2.json');

//     before(async () => {
//         let txn = new anchor.web3.Transaction();
//         txn.add(
//             systemProgram.transfer({
//                 fromPubkey: admin.publicKey,
//                 toPubkey: w1.publicKey,
//                 lamports: 10_000_000_000, // 10 SOL
//             })
//         );
//         txn.add(
//             systemProgram.transfer({
//                 fromPubkey: admin.publicKey,
//                 toPubkey: w2.publicKey,
//                 lamports: 10_000_000_000, // 10 SOL
//             })
//         );
//         await anchor.web3.sendAndConfirmTransaction(
//             program.provider.connection,
//             txn,
//             [admin]
//         );
//     });
//     it('Init admin account & change fee', async () => {
//         const [adminPDAAddress] = anchor.web3.PublicKey.findProgramAddressSync(
//             [Buffer.from('ADMIN')],
//             program.programId
//         );
//         const accounts = {
//             authority: admin.publicKey,
//             phanuelProgram: program.programId,
//             adminAccount: adminPDAAddress,
//         };
//         await program.methods
//             .initialize(new anchor.BN(1000), new anchor.BN(10000))
//             .accounts(accounts)
//             .signers([admin])
//             .rpc();
//         let adminPDA;
//         try {
//             adminPDA = await program.account.adminAccount.fetch(adminPDAAddress);
//             assert.equal(adminPDA.authority.toBase58(), admin.publicKey.toBase58());
//             assert.equal(
//                 adminPDA.closeBagFee.toNumber(),
//                 1000,
//                 'close_bag_fee mismatched'
//             );
//             assert.equal(
//                 adminPDA.createCommunityFee.toNumber(),
//                 10000,
//                 'create_community_fee mismatched'
//             );
//         } catch (e) {
//             assert.ok(false, 'Admin account not existed');
//         }
//     });
//     require('./phanuel/admin');
//     require('./phanuel/member');
//     // it('Add multiple members', async () => {
//     //   // generate randome keypair; MAX=19!
//     //   const no_member = 100;
//     //   const keypairs = [];
//     //   const memberInfoAccounts = [];
//     //   const memberAccounts = [];
//     //   const MAX_PER_INS = 18;
//     //   for (var i = 0; i < no_member; i++) {
//     //     keypairs.push(Keypair.generate());
//     //     memberAccounts.push({
//     //       pubkey: keypairs[i].publicKey,
//     //       isSigner: false,
//     //       isWritable: false,
//     //     });
//     //     const [memberInfoPDA] = anchor.web3.PublicKey.findProgramAddressSync(
//     //       [
//     //         Buffer.from('User'),
//     //         TokenPDA.toBuffer(),
//     //         keypairs[i].publicKey.toBuffer(),
//     //       ],
//     //       program.programId
//     //     );
//     //     memberInfoAccounts.push({
//     //       pubkey: memberInfoPDA,
//     //       isSigner: false,
//     //       isWritable: true,
//     //     });
//     //   }
//     //   const remainingAccounts = [...memberInfoAccounts, ...memberAccounts];
//     //   const connection = anchor.getProvider().connection;
//     //   const lookupTableAddress = await initializeLookupTable(
//     //     admin,
//     //     connection,
//     //     remainingAccounts.map((ac) => ac.pubkey)
//     //   );
//     //   await waitForNewBlock(connection, 1);
//     //   const lookupTableAccounts = (
//     //     await connection.getAddressLookupTable(lookupTableAddress)
//     //   ).value;
//     //   if (!lookupTableAccounts) {
//     //     throw new Error('Lookup table accounts not found');
//     //   }
//     //   const multipleAddMembersAccounts = {
//     //     communityAccount: TokenPDA,
//     //     admin: admin.publicKey,
//     //     phanuelProgram: program.programId,
//     //     systemProgram: anchor.web3.SystemProgram.programId,
//     //     renter: admin.publicKey,
//     //   };
//     //   // split const memberInfoAccounts, BagAccounts into group of MAX_PER_INS
//     //   for (var i = 0; i < Math.ceil(no_member / MAX_PER_INS); i++) {
//     //     const start = i * MAX_PER_INS;
//     //     const end =
//     //       start + MAX_PER_INS > no_member ? no_member : start + MAX_PER_INS;
//     //     const memberSlice = memberAccounts.slice(start, end);
//     //     const memberInfoSlice = memberInfoAccounts.slice(start, end);
//     //     const remainingAccountsSlice = [...memberSlice, ...memberInfoSlice];
//     //     const addMemberIns = await program.methods
//     //       .addMultipleMember(memberSlice.length)
//     //       .accounts(multipleAddMembersAccounts)
//     //       .remainingAccounts(remainingAccountsSlice)
//     //       .instruction();
//     //     await sendV0Transaction(
//     //       connection,
//     //       admin,
//     //       [addMemberIns],
//     //       [lookupTableAccounts]
//     //     );
//     //   }
//     //   // TODO: deactive and close
//     //   let idx = 0;
//     //   try {
//     //     for (var i = 0; i < memberAccounts.length; i++) {
//     //       const memberInfo = await program.account.memberInfo.fetch(
//     //         memberInfoAccounts[i].pubkey
//     //       );
//     //       idx = i;
//     //     }
//     //   } catch (e: any) {
//     //     assert.ok(false, 'Cannot find member at ' + idx);
//     //   }
//     // });
//     // it('Mint multiple members', async () => {
//     //   // generate randome keypair; MAX=19!
//     //   const MAX_PER_INS = 18;
//     //   const noOfMembers = 100;
//     //   const keypairs = [];
//     //   for (var i = 0; i < noOfMembers; i++) {
//     //     keypairs.push(Keypair.generate());
//     //   }
//     //   // let's add w3, w4, w5 as members
//     //   const addMember = async (pubK) => {
//     //     const [memberInfoPDA] = anchor.web3.PublicKey.findProgramAddressSync(
//     //       [Buffer.from('User'), TokenPDA.toBuffer(), pubK.toBuffer()],
//     //       program.programId
//     //     );
//     //     const addMembersAccounts = {
//     //       communityAccount: TokenPDA,
//     //       memberInfo: memberInfoPDA,
//     //       admin: admin.publicKey,
//     //       member: pubK,
//     //       phanuelProgram: program.programId,
//     //       renter: admin.publicKey,
//     //     };
//     //     await program.methods
//     //       .addMember()
//     //       .accounts(addMembersAccounts)
//     //       .signers([admin])
//     //       .rpc();
//     //     const memberInfo = await program.account.memberInfo.fetch(memberInfoPDA);
//     //     assert.equal(
//     //       memberInfo.member.toBase58(),
//     //       pubK.toBase58(),
//     //       'Member mismatched ' + pubK.toBase58()
//     //     );
//     //   };
//     //   for (var i = 0; i < keypairs.length; i++) {
//     //     await addMember(keypairs[i].publicKey);
//     //   }

//     //   const mintAmount = new anchor.BN(500);
//     //   const toMint = [...keypairs.map((k) => k.publicKey)];
//     //   const memberInfoAccounts = [];
//     //   const BagAccounts = [];
//     //   for (var i = 0; i < toMint.length; i++) {
//     //     const member = toMint[i];
//     //     const [memberInfoPDA] = anchor.web3.PublicKey.findProgramAddressSync(
//     //       [Buffer.from('User'), TokenPDA.toBuffer(), member.toBuffer()],
//     //       program.programId
//     //     );
//     //     memberInfoAccounts.push({
//     //       pubkey: memberInfoPDA,
//     //       isSigner: false,
//     //       isWritable: true,
//     //     });
//     //     const memberInfo = await program.account.memberInfo.fetch(memberInfoPDA);
//     //     const [bagPDA] = anchor.web3.PublicKey.findProgramAddressSync(
//     //       [
//     //         Buffer.from('Bag'),
//     //         memberInfoPDA.toBuffer(),
//     //         new anchor.BN(memberInfo.max).toArrayLike(Buffer, 'le', 8),
//     //       ],
//     //       program.programId
//     //     );
//     //     BagAccounts.push({ pubkey: bagPDA, isSigner: false, isWritable: true });
//     //   }
//     //   const multipleMintAccounts = {
//     //     communityAccount: TokenPDA,
//     //     admin: admin.publicKey,
//     //     clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
//     //     phanuelProgram: program.programId,
//     //     systemProgram: anchor.web3.SystemProgram.programId,
//     //     renter: admin.publicKey,
//     //   };
//     //   const remainingAccounts = [...memberInfoAccounts, ...BagAccounts];
//     //   // await program.methods
//     //   //   .multipleMint(memberInfoAccounts.length, mintAmount)
//     //   //   .accounts(multipleMintAccounts)
//     //   //   .remainingAccounts(remainingAccounts)
//     //   //   .signers([admin])
//     //   //   .rpc();
//     //   const connection = anchor.getProvider().connection;
//     //   const lookupTableAddress = await initializeLookupTable(
//     //     admin,
//     //     connection,
//     //     remainingAccounts.map((ac) => ac.pubkey)
//     //   );
//     //   await waitForNewBlock(connection, 1);

//     //   const lookupTableAccounts = (
//     //     await connection.getAddressLookupTable(lookupTableAddress)
//     //   ).value;
//     //   if (!lookupTableAccounts) {
//     //     throw new Error('Lookup table accounts not found');
//     //   }

//     //   // split const memberInfoAccounts, BagAccounts into group of MAX_PER_INS
//     //   for (var i = 0; i < Math.ceil(noOfMembers / MAX_PER_INS); i++) {
//     //     const start = i * MAX_PER_INS;
//     //     const end =
//     //       start + MAX_PER_INS > noOfMembers ? noOfMembers : start + MAX_PER_INS;
//     //     const bagSlice = BagAccounts.slice(start, end);
//     //     const memberSlice = memberInfoAccounts.slice(start, end);
//     //     const remainingAccountsSlice = [...memberSlice, ...bagSlice];
//     //     const mintIns = await program.methods
//     //       .multipleMint(memberSlice.length, mintAmount)
//     //       .accounts(multipleMintAccounts)
//     //       .remainingAccounts(remainingAccountsSlice)
//     //       .instruction();
//     //     await sendV0Transaction(
//     //       connection,
//     //       admin,
//     //       [mintIns],
//     //       [lookupTableAccounts]
//     //     );
//     //   }

//     //   // TODO: deactive and close
//     //   for (var i = 0; i < toMint.length; i++) {
//     //     // const memberInfo = await program.account.memberInfo.fetch(
//     //     //   memberInfoAccounts[i].pubkey
//     //     // );
//     //     try {
//     //       const bagInfo = await program.account.bag.fetch(BagAccounts[i].pubkey);
//     //       assert.equal(
//     //         bagInfo.amount.toNumber(),
//     //         mintAmount.toNumber(),
//     //         'Minted amount mismatched'
//     //       );
//     //     } catch (e) {
//     //       console.log(
//     //         'NOT FOUND bag: ',
//     //         BagAccounts[i].pubkey.toBase58(),
//     //         ' of ',
//     //         keypairs[i].publicKey.toBase58()
//     //       );
//     //     }
//     //   }
//     // });
//     // it('Transfer token', async () => {
//     //   const w1Info = await program.account.memberInfo.fetch(w1PDA);
//     //   const note = 'Amazing website design!';
//     //   assert.ok(w1Info.max.toNumber() > 0, 'Should have few bags here, max > 0');
//     //   // take the previous minted bag
//     //   let [w1bagPDA] = anchor.web3.PublicKey.findProgramAddressSync(
//     //     [
//     //       Buffer.from('Bag'),
//     //       w1PDA.toBuffer(),
//     //       new anchor.BN(0).toArrayLike(Buffer, 'le', 8),
//     //     ],
//     //     program.programId
//     //   );
//     //   // add w2
//     //   const addMembersAccounts = {
//     //     communityAccount: TokenPDA,
//     //     memberInfo: w2PDA,
//     //     admin: admin.publicKey,
//     //     member: w2.publicKey,
//     //     phanuelProgram: program.programId,
//     //     renter: admin.publicKey,
//     //   };
//     //   await program.methods
//     //     .addMember()
//     //     .accounts(addMembersAccounts)
//     //     .signers([admin])
//     //     .rpc();
//     //   // w1 send 100 token to w2
//     //   const w2Info = await program.account.memberInfo.fetch(w2PDA);
//     //   const toSendAmount = new anchor.BN(300);

//     //   let [w2bagPDA] = anchor.web3.PublicKey.findProgramAddressSync(
//     //     [
//     //       Buffer.from('Bag'),
//     //       w2PDA.toBuffer(),
//     //       new anchor.BN(w2Info.max).toArrayLike(Buffer, 'le', 8),
//     //     ],
//     //     program.programId
//     //   );
//     //   const [memo] = anchor.web3.PublicKey.findProgramAddressSync(
//     //     [
//     //       Buffer.from('Memo'),
//     //       w2PDA.toBuffer(),
//     //       new anchor.BN(w2Info.max).toArrayLike(Buffer, 'le', 8),
//     //     ],
//     //     program.programId
//     //   );
//     //   // substract 100 from w1bagPDA, create new w2bagPDA with 100 and a new decayAt
//     //   const transferAccounts = {
//     //     sender: w1.publicKey,
//     //     member: w2.publicKey,
//     //     receiverInfo: w2PDA,
//     //     bag: w2bagPDA,
//     //     communityAccount: TokenPDA,
//     //     phanuelProgram: program.programId,
//     //     clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
//     //     senderInfo: w1PDA,
//     //     memo,
//     //     renter: w1.publicKey,
//     //   };
//     //   try {
//     //     const w1bagInfo = await program.account.bag.fetch(w1bagPDA);
//     //     console.log('w1bagInfo, before sending: ', w1bagInfo.amount.toNumber());
//     //   } catch (e: any) {}
//     //   await program.methods
//     //     .transfer([new anchor.BN(toSendAmount)], note)
//     //     .accounts(transferAccounts)
//     //     .remainingAccounts([
//     //       {
//     //         pubkey: w1bagPDA,
//     //         isWritable: true,
//     //         isSigner: false,
//     //       },
//     //     ])
//     //     .signers([w1])
//     //     .rpc();
//     //   try {
//     //     const w1bagInfo = await program.account.bag.fetch(w1bagPDA);
//     //     const w2bagInfo = await program.account.bag.fetch(w2bagPDA);
//     //     // assert.equal(w1bagInfo.amount.toNumber(), 900);
//     //     assert.equal(w2bagInfo.amount.toNumber(), toSendAmount.toNumber());
//     //     // console.log('w1bagInfo.decayAt: ', w1bagInfo.decayAt.toNumber());
//     //     // console.log('w1bagInfo.amount: ', w1bagInfo.amount.toNumber());
//     //     // console.log('w2bagInfo.decayAt: ', w2bagInfo.decayAt.toNumber());
//     //     // console.log('w2bagInfo.amount: ', w2bagInfo.amount.toNumber());
//     //     const memoInfo = await program.account.memo.fetch(memo);
//     //     console.log('w1bagInfo, after sending: ', w1bagInfo.amount.toNumber());
//     //     console.log('w2bagInfo: ', w2bagInfo.amount.toNumber());
//     //     console.log('memoInfo: ', memoInfo.amount.toNumber());
//     //     assert.equal(memoInfo.note, note);
//     //   } catch (e) {
//     //     assert.ok(false, 'Cannot transfer');
//     //   }
//     // });
// });