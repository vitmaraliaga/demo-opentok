from opentok import OpenTok, MediaModes

opentok = OpenTok(api_key, api_secret)

session = opentok.create_session(media_mode=MediaModes.routed)

session = opentok.create_session(location=u'12.34.56.78')

session = opentok.create_session(media_mode=MediaModes.routed, archive_mode=ArchiveModes.always)

session_id = session.session_id

token = opentok.generate_token(session_id)

token = session.generate_token()

from opentok import Roles

token = session.generate_token(role=Roles.moderator,
                                    expire_time = int(time.time()) + 10,
                                    data = u'name=Johnny',
                                    initial_layout_class_list=[u'focus'])
                        
